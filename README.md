\documentclass{article}
\usepackage[margin=1in]{geometry}
\usepackage{hyperref}

\title{The End Times}
\author{}
\date{}

\begin{document}

\maketitle

\section*{Overview}
\textbf{The End Times} is a full-stack MERN creative platform for publishing and exploring art.  
Frontend: React + TypeScript (Vite), Backend: Node + Express + MongoDB.

\section*{Current Status}
\begin{itemize}
    \item Fully connected frontend \& backend
    \item REST API for users and posts with full CRUD
    \item Filtering by category and author implemented
    \item Loading and error states handled in the UI
    \item Seeded database for testing (3 users, 10 posts)
    \item Environment variables manage API URLs
\end{itemize}

\section*{Tech Stack}
\textbf{Frontend:} React, React Router, Axios, TypeScript  
\textbf{Backend:} Node.js, Express, MongoDB, Mongoose, CORS, custom middleware

\section*{Key Features}
\begin{itemize}
    \item Display posts by category or author
    \item Single post and user profile pages
    \item Responsive layout
    \item Backend validation and error handling
    \item Reusable hooks for API fetching
\end{itemize}

\section*{Project Structure}
\begin{verbatim}
frontend/
  components/ hooks/ api/ types/
backend/
  controllers/ models/ routes/ middleware/ utils/
\end{verbatim}

\section*{Getting Started}
\textbf{Backend:}
\begin{verbatim}
cd backend
npm install
npm run dev
\end{verbatim}
\textbf{Frontend:}
\begin{verbatim}
cd frontend
npm install
npm run dev
\end{verbatim}

\section*{Next Steps}
\begin{itemize}
    \item Authentication \& authorization
    \item Role-based access control
    \item Post creation/edit UI with image upload
    \item Frontend feed sorting \& accessibility improvements
\end{itemize}

\section*{Purpose}
Built as a portfolio-ready full-stack project emphasizing maintainable structure, dynamic data, and professional API practices.

\end{document}