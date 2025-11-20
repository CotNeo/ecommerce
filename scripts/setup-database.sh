#!/bin/bash

# Database setup script for all services

echo "🚀 Setting up databases for all services..."

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to setup service database
setup_service() {
    SERVICE_NAME=$1
    SCHEMA_NAME=$2
    HAS_SEED=$3

    echo -e "\n${BLUE}Setting up ${SERVICE_NAME}...${NC}"
    cd "services/${SERVICE_NAME}"

    # Generate Prisma Client
    echo "  📦 Generating Prisma Client..."
    npm run prisma:generate

    # Run migrations
    echo "  🔄 Running migrations..."
    npm run prisma:migrate -- --name init

    # Run seed if available
    if [ "$HAS_SEED" = "true" ]; then
        echo "  🌱 Seeding database..."
        npm run prisma:seed
    fi

    cd ../..
    echo -e "${GREEN}✅ ${SERVICE_NAME} setup completed!${NC}"
}

# Setup all services
setup_service "auth-service" "auth" "true"
setup_service "catalog-service" "catalog" "true"
setup_service "cart-service" "cart" "false"
setup_service "order-service" "orders" "false"
setup_service "payment-service" "payments" "false"
setup_service "notification-service" "notifications" "true"

echo -e "\n${GREEN}🎉 All databases setup completed!${NC}"

