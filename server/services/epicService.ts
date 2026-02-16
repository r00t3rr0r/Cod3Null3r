import Epic, { IEpic } from '../models/Epic';
import mongoose from 'mongoose';

class EpicService {
  async create(epicData: {
    title: string;
    description: string;
    project: mongoose.Types.ObjectId | string;
    status?: 'not-started' | 'in-progress' | 'completed';
  }): Promise<IEpic> {
    const epic = new Epic(epicData);
    return await epic.save();
  }

  async listByProject(projectId: string): Promise<IEpic[]> {
    return await Epic.find({ project: projectId }).sort({ createdAt: -1 });
  }

  async get(epicId: string): Promise<IEpic | null> {
    return await Epic.findById(epicId);
  }

  async update(epicId: string, updates: Partial<IEpic>): Promise<IEpic | null> {
    return await Epic.findByIdAndUpdate(
      epicId,
      updates,
      { new: true, runValidators: true }
    );
  }

  async delete(epicId: string): Promise<IEpic | null> {
    return await Epic.findByIdAndDelete(epicId);
  }
}

export default new EpicService();
