beforeEach(resetTestingEnvironment);
beforeEach(createDefaultLeagues);
beforeEach(createDefaultUser);

// Guarantee that tests don't run in a ongoing flush cycle.
// (not sure what this means but it's from https://github.com/Sanjo/SpaceTalk/blob/feature/testing/tests/jasmine/client/integration/beforeEach.js)
beforeEach(deferAfterFlush);
