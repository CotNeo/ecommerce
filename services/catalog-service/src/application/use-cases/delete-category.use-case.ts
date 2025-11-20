import { CategoryRepository } from '../ports/category.repository';

/**
 * Delete category use case
 */
export class DeleteCategoryUseCase {
  constructor(
    private categoryRepository: CategoryRepository = new (require('../../infrastructure/persistence/category.repository').CategoryRepositoryImpl)()
  ) {}

  async execute(id: string) {
    return this.categoryRepository.delete(id);
  }
}

