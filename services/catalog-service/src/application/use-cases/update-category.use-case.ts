import { CategoryRepository } from '../ports/category.repository';

/**
 * Update category use case
 */
export class UpdateCategoryUseCase {
  constructor(
    private categoryRepository: CategoryRepository = new (require('../../infrastructure/persistence/category.repository').CategoryRepositoryImpl)()
  ) {}

  async execute(id: string, data: {
    name?: string;
    slug?: string;
    description?: string;
    parentId?: string;
    isActive?: boolean;
  }) {
    return this.categoryRepository.update(id, data);
  }
}

