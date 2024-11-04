package main

import (
    "encoding/json"
    "fmt"
    "net/http"
    "github.com/gorilla/mux"
    "github.com/rs/cors"
)

func helloHandler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Server is Running!")
}

func SteepestAscentHandler(w http.ResponseWriter, r *http.Request) {
    data := SteepestAscentHC()
    w.Header().Set("Content-Type", "application/json")
    if err := json.NewEncoder(w).Encode(data); err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
}

func sidewaysMoveHandler(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    numberStr := vars["maxSideway"]
    maxSideway := 0

    _, err := fmt.Sscanf(numberStr, "%d", &maxSideway)
    if err != nil {
        http.Error(w, "Invalid number", http.StatusBadRequest)
        return
    }

    data := SideWaysMoveHC(maxSideway)
    w.Header().Set("Content-Type", "application/json")
    if err := json.NewEncoder(w).Encode(data); err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
}

func stochasticHandler(w http.ResponseWriter, r *http.Request) {
    data := Stochastic()
    w.Header().Set("Content-Type", "application/json")
    if err := json.NewEncoder(w).Encode(data); err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
}

func simulatedAnnealingHandler(w http.ResponseWriter, r *http.Request) {
    data := SimulatedAnnealing()
    w.Header().Set("Content-Type", "application/json")
    if err := json.NewEncoder(w).Encode(data); err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
}

func main() {
    r := mux.NewRouter()
    r.HandleFunc("/", helloHandler)
    r.HandleFunc("/steepest-ascent", SteepestAscentHandler)
    r.HandleFunc("/sideways-move/{maxSideway}", sidewaysMoveHandler)
    r.HandleFunc("/stochastic", stochasticHandler)
    r.HandleFunc("/simulated-annealing", simulatedAnnealingHandler)

    c := cors.New(cors.Options{
        AllowedOrigins:   []string{"*"},
        AllowCredentials: true,
        AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
        AllowedHeaders:   []string{"Content-Type"},
    })

    handler := c.Handler(r)

    fmt.Println("Starting server on :8080")
    err := http.ListenAndServe(":8080", handler)
    if err != nil {
        fmt.Println("Error starting server:", err)
    }
}
