import Epic from '../models/Epic';
class EpicService {
    async create(epicData) {
        const epic = new Epic(epicData);
        return await epic.save();
    }
    async listByProject(projectId) {
        return await Epic.find({ project: projectId }).sort({ createdAt: -1 });
    }
    async get(epicId) {
        return await Epic.findById(epicId);
    }
    async update(epicId, updates) {
        return await Epic.findByIdAndUpdate(epicId, updates, { new: true, runValidators: true });
    }
    async delete(epicId) {
        return await Epic.findByIdAndDelete(epicId);
    }
}
export default new EpicService();
//# sourceMappingURL=epicService.js.map