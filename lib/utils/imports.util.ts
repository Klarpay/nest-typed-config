export { plainToClass } from 'class-transformer';
export { validateSync } from 'class-validator';

// const requireFromRootNodeModules = <T = any>(moduleName: string): T => {
//   const modulePath = require.resolve(moduleName, { paths: ['../..', '.'] });
//   // eslint-disable-next-line @typescript-eslint/no-var-requires
//   return require(modulePath) as unknown as T;
// };

// export const { validateSync } = requireFromRootNodeModules<{
//   validateSync: typeof _validateSync;
// }>('class-validator');
// export const { plainToClass } = requireFromRootNodeModules<{
//   plainToClass: typeof _plainToClass;
// }>('class-transformer');
