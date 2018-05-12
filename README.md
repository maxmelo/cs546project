# cs546project
Project for CS546 at Stevens

Our webapp provides file comparison results based on user text input using Levenshtein's algorithm and other metrics determined by us.

Login and comparison history bounded to an account exists.

To seed, run "npm run seed" while your mongoDB client is running.
This creates a user "Joe Smith" with username "testUsername" and password "testPassword".

You can initially use this account or create your own.

It is populated with 4 tests:
    - comparison between the first acts of Hamlet and Macbeth
    - comparison between the first act of Hamlet with itself
    - comparison between a direct plagiarism example and the original
    - comparison between a mosaic plagiarism example and the original
    (https://www.bowdoin.edu/studentaffairs/academic-honesty/examples/)

Run "npm start" with mongoDB running to run the webapp on localhost:3000

For comparisons page, it may take a few seconds for the first compare to go through. There is no loading signal so just wait a few seconds. 