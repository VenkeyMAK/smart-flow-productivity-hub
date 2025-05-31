
import { createUser, createTask } from './db';

export const generateSampleData = async () => {
  try {
    // Create sample users
    const users = [
      {
        username: 'John Doe',
        email: 'john@example.com',
        passwordHash: btoa('password123'),
        settings: {
          theme: 'light' as const,
          notificationSounds: true,
          defaultCategory: 'work'
        }
      },
      {
        username: 'Jane Smith',
        email: 'jane@example.com',
        passwordHash: btoa('password123'),
        settings: {
          theme: 'dark' as const,
          notificationSounds: false,
          defaultCategory: 'personal'
        }
      },
      {
        username: 'Mike Johnson',
        email: 'mike@example.com',
        passwordHash: btoa('password123'),
        settings: {
          theme: 'light' as const,
          notificationSounds: true,
          defaultCategory: 'work'
        }
      }
    ];

    const createdUsers = [];
    for (const userData of users) {
      const user = await createUser(userData);
      createdUsers.push(user);
    }

    // Create sample tasks
    const taskTemplates = [
      {
        title: 'Complete project proposal',
        description: 'Finish the quarterly project proposal for the marketing team',
        status: 'in-progress' as const,
        priority: 'high' as const,
        category: 'work',
        tags: ['work', 'urgent'],
        estimatedEffort: 4
      },
      {
        title: 'Review design mockups',
        description: 'Review and provide feedback on the new app design mockups',
        status: 'pending' as const,
        priority: 'medium' as const,
        category: 'work',
        tags: ['design', 'review'],
        estimatedEffort: 2
      },
      {
        title: 'Update documentation',
        description: 'Update the API documentation with new endpoints',
        status: 'completed' as const,
        priority: 'low' as const,
        category: 'development',
        tags: ['docs', 'api'],
        estimatedEffort: 3
      },
      {
        title: 'Team meeting preparation',
        description: 'Prepare agenda and materials for the weekly team meeting',
        status: 'pending' as const,
        priority: 'medium' as const,
        category: 'work',
        tags: ['meeting', 'preparation'],
        estimatedEffort: 1
      },
      {
        title: 'Bug fix - User authentication',
        description: 'Fix the authentication bug reported by QA team',
        status: 'in-progress' as const,
        priority: 'critical' as const,
        category: 'development',
        tags: ['bug', 'critical', 'auth'],
        estimatedEffort: 6
      }
    ];

    for (const user of createdUsers) {
      for (let i = 0; i < taskTemplates.length; i++) {
        const template = taskTemplates[i % taskTemplates.length];
        await createTask({
          userId: user.id,
          title: `${template.title} - ${user.username}`,
          description: template.description,
          status: template.status,
          priority: template.priority,
          category: template.category,
          tags: template.tags,
          subtasks: [],
          dependencies: [],
          timeSpent: Math.floor(Math.random() * 8),
          estimatedEffort: template.estimatedEffort,
          dueDate: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000)
        });
      }
    }

    console.log('Sample data generated successfully!');
  } catch (error) {
    console.error('Error generating sample data:', error);
  }
};
