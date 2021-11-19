# Digits Recognizer

A Node.js application running a convolutional neural network trained for handwritten digits recognition.

You can try it out here: https://digits-recognizer-project.herokuapp.com/

# Model

## Base
First, the model was made in Python using TensorFlow and Keras. I chose a CNN as the base of the model because it is good at learning patterns and detecting features in images.
In this case, I used three convolutional blocks which are responsible for the feature extraction. The first layer of a block is a convolution layer with a ReLu activation function to filter and detect a particular feature. Because the patterns get more complex as we move forward in layers, the number of combinations enlarges too. Therefore, the filter size of the convolution layers also has to increase to capture as many as possible. Next, data pass through a maximum pooling layer to condense and enhance the features. Finally, the block ends with a dropout layer to prevent overfitting.

## Head
For the classification, I inspired myself from the LeNet-5 structure. My model's head is made up of three fully connected layers with 84, 120, and 10 neurons (in order). These are responsible for learning non-linear combinations of the high-level features coming from the base. The last layers use a softmax function to normalize the output between 0 and 1 so that the sum of each of the vector components is equal to 1. We can now see the output as the probability that the image belongs to a certain class.

## Model structure

![digits drawio (8)](https://user-images.githubusercontent.com/77757343/142507598-1d216d64-41f1-4d80-86ce-a9e683d7c9ec.png)

## Data

To train and test the model, I used the MNIST database.

# Node.js application

The application is a canvas that computes inputs so that each digit can be passed to the prediction function of the model. I used TensorFlow.js to convert the H5 model file to a usable JSON file.
