# danimail-api

This repo contains Firestore rules and indexes and the code for all the Cloud Functions.

The current setup for the Firebase project is that a client can read from Firestore as long as
it follows the defined rules, but all writing is disallowed. This is because Firestore is not
able to set different permission on a per-field basis, making it difficult to enforce that clients
do not modify data they should not be able to. As such, we are using Cloud Functions to create a
sort of backend to control what fields can and cannot be modified by the client.

## Cloud Functions Code Architecture

The `src/index.ts` file contains definitions for every function. It is written in such a way so
that each function only imports whatever files it needs so that memory usage and cold start times
and minimized. This is accomplished by using async imports within each function definition instead
of regular imports at the top of the file.

Additionally, when splitting files, there are no barrel files since we want to only import exactly
what we need. Importing a barrel file imports everything it references, even if you only need one
file from it and would defeat the purpose of this architecture.