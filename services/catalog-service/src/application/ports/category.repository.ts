/**
 * Category repository interface (port)
 */
export interface CategoryRepository {
  findAll(): Promise<Array<{
    id: string;
    name: string;
    slug: string;
    description: string | null;
    parentId: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }>>;
  findById(id: string): Promise<{
    id: string;
    name: string;
    slug: string;
    description: string | null;
    parentId: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  } | null>;
  create(data: {
    name: string;
    slug: string;
    description?: string;
    parentId?: string;
  }): Promise<{
    id: string;
    name: string;
    slug: string;
    description: string | null;
    parentId: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }>;
  update(id: string, data: {
    name?: string;
    slug?: string;
    description?: string;
    parentId?: string;
    isActive?: boolean;
  }): Promise<{
    id: string;
    name: string;
    slug: string;
    description: string | null;
    parentId: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }>;
  delete(id: string): Promise<void>;
}

