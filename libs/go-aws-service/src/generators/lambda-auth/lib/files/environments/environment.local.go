package main

type Env struct {
  Prod bool
  Local bool
}

var Environment = Env{
  Prod: false,
  Local: true,
}