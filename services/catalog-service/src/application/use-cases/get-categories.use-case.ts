import { CategoryRepository } from '../ports/category.repository';

/**
 * Get categories use case
 */
export class GetCategoriesUseCase {
  constructor(
    private categoryRepository: CategoryRepository = new (require('../../infrastructure/persistence/category.repository').CategoryRepositoryImpl)()
  ) {}

  async execute() {
    return this.categoryRepository.findAll();
  }
}

