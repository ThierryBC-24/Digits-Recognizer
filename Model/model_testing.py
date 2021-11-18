import pandas as pd
import numpy as np
from tensorflow import keras

# Load model
model = keras.models.load_model('model.h5')

# Load test data
df_test = pd.read_csv('data/test.csv')
x_test = df_test.to_numpy()
x_test = x_test.reshape(df_test.shape[0], 28, 28, 1)
x_test = x_test.astype('float32')
x_test /= 255

predictions = model.predict(x_test)
test_result = []
for i, p in enumerate(predictions):
    test_result.append([int(i+1), int(np.argmax(p))])

np.savetxt(
    'data/testResult.csv',
    test_result,
    header='ImageId,Label',
    comments='',
    delimiter=',',
    fmt='%1.1i'
)

