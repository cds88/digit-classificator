import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.datasets import mnist
import numpy as np
import matplotlib.pyplot as plt

from tensorflow.keras.preprocessing.image import ImageDataGenerator

datagen = ImageDataGenerator(
    rotation_range=20,
    width_shift_range=0.2,
    height_shift_range=0.2,
    shear_range=0.2,
    zoom_range=0.2
)


(train_x, train_y), (test_x, test_y) = mnist.load_data()


train_x = train_x.reshape(-1, 28 * 28).astype("float32") / 255.0
test_x = test_x.reshape(-1, 28 * 28).astype("float32") / 255.0


train_y = tf.keras.utils.to_categorical(train_y, 10)
test_y = tf.keras.utils.to_categorical(test_y, 10)


classification_model = models.Sequential([
    layers.Reshape((28, 28, 1), input_shape=(28 * 28,)),
    layers.Conv2D(32, (3, 3), activation='relu'),
    layers.MaxPooling2D((2, 2)),
    layers.Conv2D(64, (3, 3), activation='relu'),
    layers.MaxPooling2D((2, 2)),
    layers.Flatten(),
    layers.Dense(128, activation='relu'),
    layers.Dense(10, activation='softmax')
])


classification_model.compile(optimizer='adam',
                             loss='categorical_crossentropy',
                             metrics=['accuracy'])


classification_history = classification_model.fit(train_x, train_y,
                                                  validation_split=0.2,
                                                  epochs=10,
                                                  batch_size=64)


classification_loss, classification_accuracy = classification_model.evaluate(
    test_x, test_y)
print(f"Classification Model Accuracy: {classification_accuracy:.4f}")


encoding_dim = 64


input_img = layers.Input(shape=(28 * 28,))
encoded = layers.Dense(128, activation='relu')(input_img)
encoded = layers.Dense(encoding_dim, activation='relu')(encoded)


decoded = layers.Dense(128, activation='relu')(encoded)
decoded = layers.Dense(28 * 28, activation='sigmoid')(decoded)


autoencoder = models.Model(input_img, decoded)
autoencoder.compile(optimizer='adam', loss='mse')


autoencoder_history = autoencoder.fit(train_x, train_x,
                                      validation_split=0.2,
                                      epochs=10,
                                      batch_size=64)


reconstructed_images = autoencoder.predict(test_x)


def display_images(original, reconstructed, n=10):
    plt.figure(figsize=(20, 4))
    for i in range(n):

        ax = plt.subplot(2, n, i + 1)
        plt.imshow(original[i].reshape(28, 28), cmap='gray')
        plt.axis('off')

        ax = plt.subplot(2, n, i + 1 + n)
        plt.imshow(reconstructed[i].reshape(28, 28), cmap='gray')
        plt.axis('off')

    plt.show()


display_images(test_x, reconstructed_images)


classification_model.save("mnist_classification_model.h5")
autoencoder.save("mnist_autoencoder_model.h5")
