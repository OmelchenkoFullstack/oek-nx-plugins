import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';

describe('angular-ngrx-ddd e2e', () => {
  // Setting up individual workspaces per
  // test can cause e2e runs to take a long time.
  // For this reason, we recommend each suite only
  // consumes 1 workspace. The tests should each operate
  // on a unique project in the workspace, such that they
  // are not dependant on one another.
  beforeAll(() => {
    ensureNxProject('@oek/angular-ngrx-ddd', 'dist/packages/angular-ngrx-ddd');
  });

  afterAll(() => {
    // `nx reset` kills the daemon, and performs
    // some work which can help clean up e2e leftovers
    runNxCommandAsync('reset');
  });

  it('should create angular-ngrx-ddd', async () => {
    const project = uniq('angular-ngrx-ddd');
    await runNxCommandAsync(
      `generate @oek/angular-ngrx-ddd:angular-ngrx-ddd ${project}`
    );
    const result = await runNxCommandAsync(`build ${project}`);
    expect(result.stdout).toContain('Executor ran');
  }, 120000);

  describe('--directory', () => {
    it('should create src in the specified directory', async () => {
      const project = uniq('angular-ngrx-ddd');
      await runNxCommandAsync(
        `generate @oek/angular-ngrx-ddd:angular-ngrx-ddd ${project} --directory subdir`
      );
      expect(() =>
        checkFilesExist(`libs/subdir/domain/src/index.ts`)
      ).not.toThrow();
    }, 120000);
  });

  describe('--tags', () => {
    it('should add tags to the project', async () => {
      const projectName = uniq('angular-ngrx-ddd');
      ensureNxProject(
        '@oek/angular-ngrx-ddd',
        'dist/packages/angular-ngrx-ddd'
      );
      await runNxCommandAsync(
        `generate @oek/angular-ngrx-ddd:angular-ngrx-ddd ${projectName} --tags e2etag,e2ePackage`
      );
      const project = readJson(`libs/domain/project.json`);
      expect(project.tags).toEqual(['e2etag', 'e2ePackage']);
    }, 120000);
  });
});
