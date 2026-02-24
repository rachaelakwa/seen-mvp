# SQLAlchemy Equivalents for JavaScript

## Quick Answer

**Yes! JavaScript has several ORMs like SQLAlchemy.** The most similar is **Sequelize**, but there are newer options like Prisma and TypeORM. For your "Seen" project, you can start with raw SQL (as in the implementation guide) and upgrade to an ORM later.

---

## Comparison Table

| Framework | Type | Language | Use Case | Complexity |
|-----------|------|----------|----------|-----------|
| **Sequelize** | Full ORM | JavaScript | Similar to SQLAlchemy | Medium |
| **TypeORM** | Full ORM | TypeScript | Type-safe, modern | Medium-High |
| **Prisma** | ORM + Query Builder | JavaScript/TS | Newer, schema-driven | Low-Medium |
| **Knex.js** | Query Builder | JavaScript | Not full ORM, more control | Low |
| **MikroORM** | Full ORM | TypeScript | Dependency injection, lazy loading | High |
| **Raw pg** | None (our choice) | JavaScript | Full control, learning | Low |

---

## Detailed Comparison

### 1. **Sequelize** ⭐ Most Similar to SQLAlchemy

```javascript
// Installation
npm install sequelize pg pg-hstore

// Define Model (like SQLAlchemy models)
const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password_hash: DataTypes.STRING,
});

const ShelfItem = sequelize.define('ShelfItem', {
  title_id: DataTypes.STRING,
  note: DataTypes.TEXT,
  mood_tags: DataTypes.ARRAY(DataTypes.STRING),
});

// Define Relationships
User.hasMany(ShelfItem);
ShelfItem.belongsTo(User);

// Usage (like SQLAlchemy)
const user = await User.findByPk(userId);
const shelves = await user.getShelfItems();

const newItem = await ShelfItem.create({
  userId: user.id,
  titleId: 'soft_1',
  note: 'Great show!',
});

// Queries
const user = await User.findOne({ where: { email: 'alice@example.com' } });
const users = await User.findAll({ where: { created_at: { [Op.gte]: date } } });

await user.update({ display_name: 'Alice' });
await user.destroy(); // Delete
```

**Pros:**
- ✅ Very similar to SQLAlchemy
- ✅ Associations/relationships
- ✅ Migrations built-in
- ✅ Validations

**Cons:**
- ❌ Slower than raw SQL
- ❌ Magic (harder to debug)
- ❌ Large query overhead

---

### 2. **Prisma** ⭐ Newest & Most Intuitive

```javascript
// Installation
npm install @prisma/client
npx prisma init

// Define schema (schema.prisma)
model User {
  id        String      @id @default(cuid())
  email     String      @unique
  username  String
  passwordHash String
  displayName String?
  
  shelfItems ShelfItem[]
  createdAt DateTime @default(now())
}

model ShelfItem {
  id        String   @id @default(cuid())
  userId    String
  titleId   String
  note      String?
  moodTags  String[]
  isPrivate Boolean  @default(false)
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  savedAt DateTime @default(now())
}

// Usage (amazing autocompletion!)
const user = await prisma.user.findUnique({
  where: { email: 'alice@example.com' },
  include: { shelfItems: true },
});

const newUser = await prisma.user.create({
  data: {
    email: 'bob@example.com',
    username: 'bob',
    passwordHash: '...',
    displayName: 'Bob',
    shelfItems: {
      create: [
        { titleId: 'soft_1', note: 'Amazing!' },
        { titleId: 'fried_2', note: 'Fun' },
      ],
    },
  },
  include: { shelfItems: true },
});

await prisma.user.update({
  where: { id: userId },
  data: { displayName: 'Alice Smith' },
});

await prisma.shelfItem.delete({
  where: { id: itemId },
});
```

**Pros:**
- ✅ Schema is source of truth
- ✅ Excellent TypeScript support
- ✅ Auto-generated query client
- ✅ Easy migrations
- ✅ Great for rapid development

**Cons:**
- ❌ Younger ecosystem
- ❌ Less Stack Overflow help
- ❌ Vendor lock-in (Prisma cloud)

---

### 3. **TypeORM** ⭐ For TypeScript Projects

```typescript
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  username: string;

  @Column()
  passwordHash: string;

  @OneToMany(() => ShelfItem, shelf => shelf.user)
  shelfItems: ShelfItem[];
}

@Entity()
export class ShelfItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  titleId: string;

  @Column({ type: 'text', nullable: true })
  note: string;

  @Column('simple-array')
  moodTags: string[];

  @ManyToOne(() => User, user => user.shelfItems)
  user: User;
}

// Usage
const userRepo = AppDataSource.getRepository(User);
const user = await userRepo.findOne({
  where: { email: 'alice@example.com' },
  relations: ['shelfItems'],
});

const newShelf = ShelfItem.create({
  titleId: 'soft_1',
  note: 'Great!',
  user: user,
});
await AppDataSource.getRepository(ShelfItem).save(newShelf);
```

**Pros:**
- ✅ Strong TypeScript support
- ✅ Decorators (clean syntax)
- ✅ Supports many databases
- ✅ Lazy loading

**Cons:**
- ❌ Requires TypeScript
- ❌ Steeper learning curve
- ❌ More boilerplate

---

### 4. **Knex.js** ⭐ Query Builder (Not Full ORM)

```javascript
// Installation
npm install knex pg

// Create instance
const knex = require('knex')({
  client: 'pg',
  connection: process.env.DATABASE_URL,
});

// Usage (SQL-like, but JavaScript)
const user = await knex('users')
  .where({ email: 'alice@example.com' })
  .first();

const users = await knex('users')
  .where('created_at', '>=', '2026-01-01')
  .orderBy('created_at', 'desc');

const newUser = await knex('users').insert({
  email: 'bob@example.com',
  username: 'bob',
  password_hash: '...',
});

await knex('users')
  .where({ id: userId })
  .update({ display_name: 'Alice Smith' });

await knex('shelf_items')
  .where({ id: itemId })
  .delete();

// You still write SQL for complex queries
const results = await knex.raw(
  'SELECT * FROM users WHERE email = ?',
  [email]
);
```

**Pros:**
- ✅ NOT a full ORM (full control)
- ✅ Clean query syntax
- ✅ Easy to learn
- ✅ Good for SQL knowledge
- ✅ Works with raw queries

**Cons:**
- ❌ No relationships built-in
- ❌ More manual relationship handling
- ❌ Not as magical

---

### 5. **MikroORM** ⭐ Advanced Use Case

```typescript
import { Entity, PrimaryKey, Property, OneToMany, Collection } from '@mikro-orm/core';

@Entity()
export class User {
  @PrimaryKey()
  id: string;

  @Property({ unique: true })
  email: string;

  @OneToMany(() => ShelfItem, shelf => shelf.user)
  shelfItems = new Collection<ShelfItem>(this);
}

// Supports dependency injection
const userRepository = em.getRepository(User);
const user = await userRepository.findOne({ email: 'alice@example.com' });

// Lazy loading supported
await user.shelfItems.init(); // Load relations on demand
```

**Pros:**
- ✅ Dependency injection
- ✅ Lazy loading by default
- ✅ Identity map pattern

**Cons:**
- ❌ Steeper learning curve
- ❌ Less adoption
- ❌ Smaller community

---

## Recommendation for "Seen"

### Phase 1 (Current): **Raw SQL** ✅

```javascript
// What you're doing now
await pool.query(
  'SELECT * FROM users WHERE email = $1',
  [email]
);
```

**Why?**
- ✅ Direct control
- ✅ Learn SQL fundamentals
- ✅ No ORM overhead
- ✅ Good for small projects
- ✅ Easy to refactor to ORM later

---

### Phase 2 (Optional): Migrate to **Prisma** or **Sequelize**

**When?**
- If backend becomes complex (10+ tables)
- If adding complex relationships
- If team wants more abstraction

**Prisma (Recommended):**
```javascript
// Just update schema and regenerate client
model Circle {
  id String @id @default(cuid())
  userId String
  friendId String
  
  user User @relation("userCircles", fields: [userId], references: [id])
  friend User @relation("friendCircles", fields: [friendId], references: [id])
}

// Then in code:
await prisma.circle.create({
  data: { userId, friendId },
});

await prisma.user.findUnique({
  where: { id },
  include: { circles: true }, // Auto-loads relationships
});
```

**Sequelize:**
```javascript
// Define model and association
const Circle = sequelize.define('Circle', {
  userId: DataTypes.UUID,
  friendId: DataTypes.UUID,
});

Circle.belongsTo(User, { as: 'user', foreignKey: 'userId' });
Circle.belongsTo(User, { as: 'friend', foreignKey: 'friendId' });

// In code:
const circle = await Circle.create({ userId, friendId });
const user = await User.findByPk(userId, { include: ['circles'] });
```

---

## Migration Path Example

### Starting with Raw SQL

```javascript
// User.js (Model)
class User {
  static async findByEmail(email) {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];
  }
}

// authController.js
const user = await User.findByEmail(email);
```

### Later: Switch to Prisma

```javascript
// Just delete User.js, now use prisma directly
const user = await prisma.user.findUnique({
  where: { email },
});

// Controllers and routes stay the same!
```

**Key insight:** The controller layer doesn't change when you upgrade ORMs!

---

## Final Recommendation

### For "Seen" MVP:

| Phase | Approach | Why |
|-------|----------|-----|
| **Phase 1** | Raw SQL (current) | Fast, lean, learn SQL |
| **Phase 2** | Keep raw SQL | Still simple, ~5 tables |
| **Phase 3** | Migrate to Prisma | If friends/circles get complex |

**Don't over-engineer!** Raw SQL works fine for "Seen". Only migrate to ORM if you hit real complexity.

---

## Glossary

| Term | Meaning | Example |
|------|---------|---------|
| **ORM** | Object-Relational Mapping | Map database rows to JS objects |
| **Model** | Class that maps to table | User class = users table |
| **Association** | Relationship between models | User has many ShelfItems |
| **Query Builder** | SQL generator | Knex builds SELECT statements |
| **Schema** | Database structure definition | Prisma schema.prisma file |
| **Migration** | Database version control | Add column to table |
| **Lazy Loading** | Load data on demand | Don't fetch user.shelfItems until accessed |
| **Eager Loading** | Load data upfront | Fetch user AND shelfItems together |
