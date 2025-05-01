import { DifficultyEnum } from 'modules/question/dto/question.dto';
import { Question } from 'modules/question/entities/question.entity';
import { DataSource } from 'typeorm';

const seed_questions: {
  title: string;
  description: string;
  difficulty: DifficultyEnum;
}[] = [
  {
    title: 'Two Sum',
    description:
      'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    difficulty: DifficultyEnum.EASY,
  },
  {
    title: 'Reverse Linked List',
    description: 'Reverse a singly linked list.',
    difficulty: DifficultyEnum.EASY,
  },
  {
    title: 'Longest Substring Without Repeating Characters',
    description:
      'Given a string s, find the length of the longest substring without repeating characters.',
    difficulty: DifficultyEnum.MEDIUM,
  },
  {
    title: 'Merge Intervals',
    description:
      'Given an array of intervals, merge all overlapping intervals.',
    difficulty: DifficultyEnum.MEDIUM,
  },
  {
    title: 'Word Ladder',
    description:
      'Given two words and a dictionary, find the shortest transformation sequence.',
    difficulty: DifficultyEnum.HARD,
  },

  {
    title: 'Valid Parentheses',
    description:
      "Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    difficulty: DifficultyEnum.EASY,
  },
  {
    title: 'Climbing Stairs',
    description:
      'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
    difficulty: DifficultyEnum.EASY,
  },
  {
    title: 'Maximum Subarray',
    description:
      'Given an integer array nums, find the contiguous subarray with the largest sum.',
    difficulty: DifficultyEnum.MEDIUM,
  },
  {
    title: 'Container With Most Water',
    description:
      'Given n non-negative integers, find two lines that together with the x-axis form a container, such that the container contains the most water.',
    difficulty: DifficultyEnum.MEDIUM,
  },
  {
    title: 'Kth Largest Element in an Array',
    description: 'Find the kth largest element in an unsorted array.',
    difficulty: DifficultyEnum.MEDIUM,
  },
  {
    title: 'LRU Cache',
    description:
      'Design and implement a data structure for Least Recently Used (LRU) cache.',
    difficulty: DifficultyEnum.HARD,
  },
  {
    title: 'Trapping Rain Water',
    description:
      'Given n non-negative integers representing an elevation map, compute how much water it can trap after raining.',
    difficulty: DifficultyEnum.HARD,
  },
  {
    title: 'Serialize and Deserialize Binary Tree',
    description:
      'Design an algorithm to serialize and deserialize a binary tree.',
    difficulty: DifficultyEnum.HARD,
  },
  {
    title: 'Binary Tree Level Order Traversal',
    description:
      "Given the root of a binary tree, return the level order traversal of its nodes' values.",
    difficulty: DifficultyEnum.MEDIUM,
  },
  {
    title: 'Search in Rotated Sorted Array',
    description: 'Search for a target value in a rotated sorted array.',
    difficulty: DifficultyEnum.MEDIUM,
  },
  {
    title: 'Detect Cycle in a Linked List',
    description: 'Given a linked list, determine if it has a cycle in it.',
    difficulty: DifficultyEnum.EASY,
  },
  {
    title: 'Implement Trie (Prefix Tree)',
    description:
      'Implement a trie with insert, search, and startsWith methods.',
    difficulty: DifficultyEnum.MEDIUM,
  },
  {
    title: 'Minimum Window Substring',
    description:
      'Given two strings s and t, return the minimum window in s which contains all the characters of t.',
    difficulty: DifficultyEnum.HARD,
  },
  {
    title: 'Alien Dictionary',
    description:
      'Given a sorted dictionary of an alien language, find order of characters in the language.',
    difficulty: DifficultyEnum.HARD,
  },
  {
    title: 'Find Median from Data Stream',
    description:
      'The median is the middle value in an ordered list of integers. Design a data structure that supports efficient median retrieval.',
    difficulty: DifficultyEnum.HARD,
  },
];

export const generateFakeQuestions = async (connection: DataSource) => {
  const questionsResp = connection.getRepository(Question);
  const questionsEntities: Partial<Question>[] = seed_questions.map(
    question => ({
      title: question.title,
      description: question.description,
      difficulty: question.difficulty,
    }),
  );

  await Promise.allSettled(questionsEntities.map(q => questionsResp.save(q)));
};
