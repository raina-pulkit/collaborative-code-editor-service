import connectionSource from '../../../ormconfig';
import { generateFakeQuestions } from './questions';

const insertFakeQuestions = async (): Promise<void> => {
  await connectionSource.initialize();
  await generateFakeQuestions(connectionSource);
  await connectionSource.destroy();
  console.log('Fake questions inserted successfully.');
};

insertFakeQuestions()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Error inserting fake questions:', error);
    process.exit(1);
  });
