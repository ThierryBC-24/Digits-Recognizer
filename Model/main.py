import pandas as pd
import matplotlib.pyplot as plt
from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.utils import plot_model
from tensorflow.keras.callbacks import EarlyStopping
from tensorflow.keras.layers.experimental import preprocessing

# Variables
IMG_height, IMG_width = 28, 28
channels_dimension = 1
n_class = 10

# Load digits data
digits = pd.read_csv('data/train.csv')

# Split data into training and validation DataFrames
df_train = digits.sample(frac=0.7, random_state=0)
df_valid = digits.drop(df_train.index)

# Split each DataFrames into input and target numpy array
x_train = df_train.drop('label', axis='columns').to_numpy()
x_valid = df_valid.drop('label', axis='columns').to_numpy()

y_valid = df_valid['label'].to_numpy()
y_train = df_train['label'].to_numpy()

# Reshape inputs 2D arrays into 4D (including channels dimension)
input_shape = [IMG_width, IMG_height, channels_dimension]
x_train = x_train.reshape(df_train.shape[0], input_shape[0], input_shape[1], input_shape[2])
x_valid = x_valid.reshape(df_valid.shape[0], input_shape[0], input_shape[1], input_shape[2])
x_train = x_train.astype('float32')
x_valid = x_valid.astype('float32')

# Normalize inputs between 0-1
x_train /= 255
x_valid /= 255

# Convert labels into one-hot vector
y_train = keras.utils.to_categorical(y_train, n_class)
y_valid = keras.utils.to_categorical(y_valid, n_class)

# Model construction
model = keras.Sequential([
    # Data augmentation
    preprocessing.RandomTranslation(height_factor=0.1, width_factor=0.1),

    # First convolutional block
    layers.BatchNormalization(renorm=True),
    layers.Conv2D(filters=32, kernel_size=[3,3], padding='same', activation='relu', input_shape=input_shape),
    layers.MaxPool2D(pool_size=(2, 2), strides=2),
    layers.Dropout(rate=0.3),

    # Second convolutional block
    layers.BatchNormalization(renorm=True),
    layers.Conv2D(filters=64, kernel_size=[3, 3], padding='same', activation='relu'),
    layers.MaxPool2D(pool_size=(2, 2), strides=2),
    layers.Dropout(rate=0.3),

    # Third convolutional block
    layers.BatchNormalization(renorm=True),
    layers.Conv2D(filters=128, kernel_size=[3, 3], padding='same', activation='relu'),
    layers.MaxPool2D(pool_size=(2, 2), strides=2),
    layers.Dropout(rate=0.3),

    # Classifier head
    layers.BatchNormalization(renorm=True),
    layers.Flatten(),
    layers.Dense(120, activation='relu'),
    layers.Dropout(rate=0.3),
    layers.Dense(84, activation='relu'),
    layers.Dropout(rate=0.3),
    layers.Dense(n_class, activation='softmax')
])

# Model configuration
model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['categorical_accuracy']
)

early_stopping = EarlyStopping(
    min_delta=0.01,
    patience=20,
    restore_best_weights=True
)

# Model training
history = model.fit(
    x_train, y_train,
    validation_data=(x_valid,y_valid),
    epochs=500,
    batch_size=32,
    callbacks=early_stopping,
    verbose=1
)

# Saving model structure
plot_model(model, to_file='model.png', show_shapes=True)
model.save('digits_recognizer.h5')

# Loss history
plt.plot(history.history['loss'])
plt.plot(history.history['val_loss'])
plt.xlabel('epoch')
plt.ylabel('loss')
plt.legend(['train', 'validation'], loc='upper right')
plt.savefig('loss_history.png')

# Accuracy history
plt.clf()
plt.plot(history.history['categorical_accuracy'])
plt.plot(history.history['val_categorical_accuracy'])
plt.xlabel('epoch')
plt.ylabel('accuracy')
plt.legend(['train', 'validation'], loc='upper right')
plt.savefig('accuracy_history.png')
