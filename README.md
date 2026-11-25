# Smart City Route Optimization System

An interactive web application implementing **Dijkstra’s** and **Bellman-Ford** shortest-path algorithms for urban route optimization.

## Features
- **Interactive City Graph:** Click junctions to set Source/Destination, click road badges to edit weights, add new locations, and switch across city presets (`Small`, `Medium`, `Large`, and `Negative Edge`).
- **Dual Algorithm Engine:** Compares **Dijkstra’s Algorithm** and **Bellman-Ford Algorithm** with shortest cost, route path, operation counts, and execution time.
- **Negative Weight & Cycle Handling:** Highlights when negative edge weights exist and detects negative cycles in Bellman-Ford.
- **Graph Size Benchmarking:** Benchmarks average execution times across varying vertex/edge counts.

## Running Locally
1. Open the project folder in **VS Code**.
2. Run with **Live Server** extension or open `index.html` directly in any modern browser.