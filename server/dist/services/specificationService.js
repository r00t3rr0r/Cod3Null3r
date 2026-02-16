import Specification from '../models/Specification';
class SpecificationService {
    async create(specData) {
        const specification = new Specification(specData);
        return await specification.save();
    }
    async getByProject(projectId) {
        return await Specification.findOne({ project: projectId }).sort({ createdAt: -1 });
    }
    async get(specId) {
        return await Specification.findById(specId);
    }
    async update(specId, updates) {
        return await Specification.findByIdAndUpdate(specId, updates, { new: true, runValidators: true });
    }
    async delete(specId) {
        return await Specification.findByIdAndDelete(specId);
    }
}
export default new SpecificationService();
//# sourceMappingURL=specificationService.js.map