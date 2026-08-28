# How to query an R project with flowR

This is a sample project that demonstrates how to use the [`flowR`](https://github.com/flowr-analysis/flowr) library to analyze and query R projects. Follow the steps below to set up and run the project.

Please note that this is a minimal example, with bigger files JavaScript's `JSON.stringify` might encounter a too-long string, in such cases it is up to you to serialize/compress the results (check out the flowR wiki, we offer several ways to handle large results).

If you want to try this out with docker, you can run the following in your directory (or add paths to your liking)
to use a deployed [docker image](https://hub.docker.com/r/eagleoutice/sample-flowr-project-query):

```bash
 docker run -it --rm -u "$(id -u):$(id -g)" -v "$PWD":"/data" eagleoutice/sample-flowr-project-query:latest /data/sample-project /data/output.json
 ```

## Quickstart

1. Clone the repository:

   ```bash
   git clone https://github.com/flowr-analysis/sample-analyzer-project-query.git
   cd sample-analyzer-project-query
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Run the main script with a project folder and a file to dump the results to:

   ```bash  
   npm run main -- sample-project output.json
   ```

4. Check the `output.json` file for the query results.

## Changing the Query

See [`src/query.ts`](src/query.ts) to modify the query that is run against the R project.
