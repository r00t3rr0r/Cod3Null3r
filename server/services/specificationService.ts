import Specification, { ISpecification } from '../models/Specification';

class SpecificationService {
  async create(specData: Partial<ISpecification>): Promise<ISpecification> {
    const specification = new Specification(specData);
    return await specification.save();
  }

  async getByProject(projectId: string): Promise<ISpecification | null> {
    return await Specification.findOne({ project: projectId }).sort({ createdAt: -1 });
  }

  async get(specId: string): Promise<ISpecification | null> {
    return await Specification.findById(specId);
  }

  async update(specId: string, updates: Partial<ISpecification>): Promise<ISpecification | null> {
    return await Specification.findByIdAndUpdate(
      specId,
      updates,
      { new: true, runValidators: true }
    );
  }

  async delete(specId: string): Promise<ISpecification | null> {
    return await Specification.findByIdAndDelete(specId);
  }
}

export default new SpecificationService();
