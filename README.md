# Movie Recommendation System

A modern web application that helps users discover movies they'll enjoy. The system combines TMDB's extensive movie database with machine learning to provide personalized movie recommendations.

## Features

- 🎬 Search through a vast database of movies
- 🔍 Real-time search with debounced input
- 📈 View trending movies
- 💡 Get personalized movie recommendations
- 🎯 Content-based filtering using movie attributes
- 📱 Responsive design for all devices

## Tech Stack

### Frontend

- React.js with Vite
- Tailwind CSS for styling
- React Query for data fetching
- Shadcn UI components
- React Use for utility hooks

### Backend

- Flask for the REST API
- scikit-learn for recommendation engine
- TMDB API for movie data
- Pandas for data manipulation

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- TMDB API key

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/movie-recommendation-system.git
cd movie-recommendation-system
```

2. Set up the frontend:

```bash
cd frontend
npm install
```

3. Set up the backend:

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
```

4. Create `.env` files:

Frontend (.env):

```env
VITE_TMDB_API_KEY=your_tmdb_api_key
VITE_API_BASE_URL=http://localhost:8080
```

Backend (.env):

```env
VITE_TMDB_API_KEY=your_tmdb_api_key
FLASK_DEBUG=True
FLASK_PORT=8080
```

### Running the Application

1. Start the backend server:

```bash
cd backend
python app.py
```

2. Start the frontend development server:

```bash
cd frontend
npm run dev
```

4. Open http://localhost:5173 in your browser

## Project Structure

```
movie-recommendation-system/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── services/
│   │   └── movie_service.py
│   ├── utils/
│   │   └── error_handlers.py
│   ├── app.py
│   ├── config.py
│   ├── requirements.txt
│   └── movies_dict.pkl
│
└── README.md
```

## API Endpoints

### `GET /api/recommend/<movie_title>`

Get movie recommendations based on a given movie title.

Response:

```json
[
  {
    "id": 123,
    "title": "Movie Title",
    "vote_average": 8.5,
    "poster_path": "/path/to/poster.jpg",
    "release_date": "2023",
    "original_language": "en"
  }
]
```

### `GET /health`

Check the health status of the API and Redis connection.

Response:

```json
{
  "status": "healthy"
}
```

## Performance Optimizations

- Debounced search to reduce API calls
- Rate limiting to prevent abuse
- Lazy loading of images
- Optimized similarity matrix computation
- Proper error handling and fallbacks

## Deployment

### Frontend

The frontend can be deployed to platforms like Vercel, Netlify, or Firebase:

```bash
cd frontend
npm run build
```

### Backend

The backend can be deployed to platforms like Heroku, DigitalOcean, or AWS:

1. Install Gunicorn:

```bash
pip install gunicorn
```

2. Run with Gunicorn:

```bash
gunicorn "app:create_app()" --workers 4 --bind 0.0.0.0:$PORT
```

Remember to:

- Set up environment variables on your hosting platform
- Set up proper CORS settings
- Configure proper security headers

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/improvement`)
3. Make changes and commit (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/improvement`)
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- TMDB API for providing movie data
- Scikit-learn for machine learning tools
- Shadcn UI for beautiful components
- The open-source community for various tools and libraries
