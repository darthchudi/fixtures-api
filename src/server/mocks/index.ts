import faker from 'faker';

const getRandom = items => {
  return items[Math.floor(Math.random() * items.length)];
};

const stadiums = [
  'Stamford Bridge',
  'Emirates Stadium',
  'Old Trafford',
  'Allianz',
  'Camp Nou',
];

export const UserRequest = () => ({
  email: faker.internet.email(),
  first_name: faker.name.firstName(),
  role: 'user',
  last_name: faker.name.lastName(),
  password: 'test-password',
  username: faker.internet.userName(),
});

export const TeamRequest = () => ({
  city: faker.address.city(),
  name: faker.company.companyName(),
  short_name: faker.name.lastName(),
  stadium: faker.address.secondaryAddress(),
});

export const FixtureRequest = () => ({
  date: new Date(),
  stadium: getRandom(stadiums),
  match_day: getRandom([1, 2, 4, 10]),
  time: getRandom(['1pm', '2pm', '10pm']),
});
