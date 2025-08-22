package main

import (
	"log"
	"net/http"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/FlxdeCat/faREbook-backend/database"
	"github.com/FlxdeCat/faREbook-backend/graph"
	"github.com/FlxdeCat/faREbook-backend/helper"
	"github.com/go-redis/redis/v8"
	"github.com/rs/cors"
)

const defaultPort = "8080"

func main() {

	client := redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "",
		DB:       0,
	})

	port := helper.GetEnvVariable("PORT")
	if port == "" {
		port = defaultPort
	}

	database.MigrateTable()

	srv := handler.NewDefaultServer(graph.NewExecutableSchema(graph.Config{Resolvers: &graph.Resolver{
		DB:    database.GetInstance(),
		REDIS: client,
	}}))

	mux := http.NewServeMux()
	mux.Handle("/", playground.Handler("GraphQL playground", "/query"))
	mux.Handle("/query", srv)

	c := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:5173"},
		AllowedMethods: []string{http.MethodGet, http.MethodPost},
	})
	corsHandler := c.Handler(mux)

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, corsHandler))
}
