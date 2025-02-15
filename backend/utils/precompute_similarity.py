import pickle
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Load movie data
with open("movies_dict.pkl", "rb") as f:
    movies_dict = pickle.load(f)
movies = pd.DataFrame(movies_dict)

# Create and fit CountVectorizer
cv = CountVectorizer(max_features=5000, stop_words="english")
vectors = cv.fit_transform(movies["tags"]).toarray()

# Compute similarity matrix
similarity = cosine_similarity(vectors)

# Save the similarity matrix
np.save("similarity_matrix.npy", similarity)
print("Similarity matrix saved successfully!")
