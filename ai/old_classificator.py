import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.datasets import mnist
import numpy as np
import matplotlib.pyplot as plt


(train_x, train_y), (test_x, test_y) = mnist.load_data()


train_x = train_x.reshape(-1, 28 * 28).astype("float32") / 255.0
test_x = test_x.reshape(-1, 28 * 28).astype("float32") / 255.0


train_y = tf.keras.utils.to_categorical(train_y, 10)
test_y = tf.keras.utils.to_categorical(test_y, 10)


# Progressive Dimensionality Reduction
classification_model = models.Sequential([
    layers.Dense(256, activation='relu', input_shape=(28 * 28,)),
    layers.Dense(128, activation='relu'),
    layers.Dense(64, activation='relu'),
    layers.Dense(10, activation='softmax')
])

classification_model.compile(optimizer='adam',
                             loss='categorical_crossentropy',
                             metrics=['accuracy'])

# Train the classification model
classification_history = classification_model.fit(train_x, train_y, 
                                                  validation_split=0.2, 
                                                  epochs=10, 
                                                  batch_size=64)

# Evaluate the classification model
classification_loss, classification_accuracy = classification_model.evaluate(test_x, test_y)
print(f"Classification Model Accuracy: {classification_accuracy:.4f}")


# 2. Fully Connected Autoencoder
encoding_dim = 64

# Encoder
input_img = layers.Input(shape=(28 * 28,))
encoded = layers.Dense(128, activation='relu')(input_img)
encoded = layers.Dense(encoding_dim, activation='relu')(encoded)

# Decoder
decoded = layers.Dense(128, activation='relu')(encoded)
decoded = layers.Dense(28 * 28, activation='sigmoid')(decoded)

# Autoencoder Model
autoencoder = models.Model(input_img, decoded)
autoencoder.compile(optimizer='adam', loss='mse')

# Train the autoencoder
autoencoder_history = autoencoder.fit(train_x, train_x, 
                                      validation_split=0.2, 
                                      epochs=10, 
                                      batch_size=64)

# Evaluate the autoencoder
reconstructed_images = autoencoder.predict(test_x)

# Display original and reconstructed images
def display_images(original, reconstructed, n=10):
    plt.figure(figsize=(20, 4))
    for i in range(n):
        # Original images
        ax = plt.subplot(2, n, i + 1)
        plt.imshow(original[i].reshape(28, 28), cmap='gray')
        plt.axis('off')

        # Reconstructed images
        ax = plt.subplot(2, n, i + 1 + n)
        plt.imshow(reconstructed[i].reshape(28, 28), cmap='gray')
        plt.axis('off')

    plt.show()

#display_images(test_x, reconstructed_images)

# Save models
classification_model.save("mnist_classification_model.h5")
autoencoder.save("mnist_autoencoder_model.h5")
