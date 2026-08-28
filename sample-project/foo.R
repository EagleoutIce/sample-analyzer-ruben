sum <- 0
library(ggplot2)
r <- read.csv("foo")

2 + 3

if(sum > 25) {
  cat("Sum is greater than 25\n")
  sum <- 0
} else { 
  cat("Sum is less than 25\n")
}

print(sum)

xx <- function(sum) {
    repeat {
      sum <- sum + 1
      if(sum > 25) {
        next
      }
      print(sum)
      if(sum == 0) {
        break
      }
      print(3)
    }
}


while(sum > 0) {
  sum <- sum - 1
  print(sum)
}

print(sum)

for(i in 1:10) {
  print(i)
  if(i == 5) {
    next
  }
}

higherOrder <- function(x) {
  function(y) x + y
}

df <- data.frame(a = 1:5, b = 6:10)

df$c <- 1:nrow(df)

print(df)