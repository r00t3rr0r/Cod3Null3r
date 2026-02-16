import { ISpecification } from '../models/Specification';
declare class SpecificationService {
    create(specData: Partial<ISpecification>): Promise<ISpecification>;
    getByProject(projectId: string): Promise<ISpecification | null>;
    get(specId: string): Promise<ISpecification | null>;
    update(specId: string, updates: Partial<ISpecification>): Promise<ISpecification | null>;
    delete(specId: string): Promise<ISpecification | null>;
}
declare const _default: SpecificationService;
export default _default;
//# sourceMappingURL=specificationService.d.ts.map