package main

import (
    "fmt"
    "math/rand"
    "net/http"
    "time"

    "github.com/gin-gonic/gin"
    "github.com/rs/cors"
)

func helloHandler(c *gin.Context) {
    c.String(http.StatusOK, "Server is Running!")
}

func SteepestAscentHandler(c *gin.Context) {
    data := SteepestAscentHC()
    c.JSON(http.StatusOK, data)
}

func sidewaysMoveHandler(c *gin.Context) {
    maxSidewayStr := c.Param("maxSideway")
    maxSideway := 0

    _, err := fmt.Sscanf(maxSidewayStr, "%d", &maxSideway)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid number"})
        return
    }

    data := SideWaysMoveHC(maxSideway)
    c.JSON(http.StatusOK, data)
}

func randomRestartHandler(c *gin.Context) {
    maxRestartStr := c.Param("maxRestart")
    maxRestart := 0

    _, err := fmt.Sscanf(maxRestartStr, "%d", &maxRestart)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid number"})
        return
    }

    data := RandomRestartHC(maxRestart)
    c.JSON(http.StatusOK, data)
}

func stochasticHandler(c *gin.Context) {
    data := Stochastic()
    c.JSON(http.StatusOK, data)
}

func simulatedAnnealingHandler(c *gin.Context) {
    data := SimulatedAnnealing()
    c.JSON(http.StatusOK, data)
}

func geneticHandler(c *gin.Context) {
    nPopulationStr := c.Param("nPopulation")
    nIterationStr := c.Param("nIteration")
    var nPopulation, nIteration int

    _, err := fmt.Sscanf(nPopulationStr, "%d", &nPopulation)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid number"})
        return
    }

    _, err = fmt.Sscanf(nIterationStr, "%d", &nIteration)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid number"})
        return
    }

    data := GeneticAlgorithm(nPopulation, nIteration)
    c.JSON(http.StatusOK, data)
}

func main() {
    rand.Seed(time.Now().UnixNano())
    r := gin.Default()

    r.Use(func(c *gin.Context) {
        corsConfig := cors.New(cors.Options{
            AllowedOrigins:   []string{"*"},
            AllowCredentials: true,
            AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
            AllowedHeaders:   []string{"Content-Type"},
        })
        corsConfig.HandlerFunc(c.Writer, c.Request)
        c.Next()
    })

    r.GET("/", helloHandler)
    r.GET("/steepest-ascent", SteepestAscentHandler)
    r.GET("/sideways-move/:maxSideway", sidewaysMoveHandler)
    r.GET("/random-restart/:maxRestart", randomRestartHandler)
    r.GET("/stochastic", stochasticHandler)
    r.GET("/simulated-annealing", simulatedAnnealingHandler)
    r.GET("/genetic-algo/:nPopulation/:nIteration", geneticHandler)

    fmt.Println("Starting server on :8080")
    if err := r.Run(":8080"); err != nil {
        fmt.Println("Error starting server:", err)
    }
}
