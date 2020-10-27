import axios from 'axios';

const API_URL = 'https://backendapprifa.herokuapp.com/student';

//validando para não colocar valor fora do que pode da nota
const GRADE_VALIDATION = [
  {
    id: 1,
    gradeType: 'Exercícios',
    minValue: 0,
    maxValue: 10,
  },
  {
    id: 2,
    gradeType: 'Trabalho Prático',
    minValue: 0,
    maxValue: 40,
  },
  {
    id: 3,
    gradeType: 'Desafio',
    minValue: 0,
    maxValue: 50,
  },
];

async function getAllGrades() {
  //fetch para escrito, axios interpreta json, pode escrever, diferente do fetch
  const res = await axios.get(API_URL);

  const grades = res.data.map((grade) => {
    const { client } = grade;
    return {
      ...grade,
      clientLowerCase: client.toLowerCase(),
      isDeleted: false,
    };
  });

  //set no js simula conjunto, elementos não podem repetir
  //não precisa fazer vários ifs
  // let allRifanumbers = new Set();
  // grades.forEach((grade) => allRifanumbers.add(grade.rifanumber));
  // allRifanumbers = Array.from(allRifanumbers);

  // let allClients = new Set();
  // grades.forEach((grade) => allClients.add(grade.client));
  // allClients = Array.from(allClients);

  // let allTelefones = new Set();
  // grades.forEach((grade) => allTelefones.add(grade.telefone));
  // allTelefones = Array.from(allTelefones);

  // let maxId = -1;
  // grades.forEach(({ id }) => {
  //   if (id > maxId) {
  //     maxId = id;
  //     //grades.rifanumber = id;
  //   }
  // });
  // let nextId = maxId + 1;
  // const usersCombinations = [];
  // allRifanumbers.forEach((rifanumber) => {
  //   allClients.forEach((client) => {
  //     usersCombinations.push({
  //       rifanumber,
  //       client,
  //     });
  //   });
  // });

  // usersCombinations.forEach(({ rifanumber, client }) => {
  //   const callitem = grades.find((grade) => {
  //     return grade.rifanumber === rifanumber && grade.client === client;
  //   });

  //   if (!callitem) {
  //     grades.push({
  //       id: nextId++,
  //       client,
  //       clientLowerCase: client.toLowerCase(),
  //       isDeleted: true,
  //     });
  //   }
  // });

  grades.sort((a, b) => a.clientLowerCase.localeCompare(b.clientLowerCase));

  return grades;
}

async function insertGrade(grade) {
  const response = await axios.post(API_URL, grade);
  return response.data.id;
}
async function updateGrade(grade) {
  const response = await axios.put(API_URL, grade);
  return response.data;
}
async function deleteGrade(grade) {
  const response = await axios.delete(`${API_URL}/${grade.id}`);
  return response.data;
}

async function getValidationFromGradeType(gradeType) {
  const gradeValidation = GRADE_VALIDATION.find(
    (item) => item.gradeType === gradeType
  );
  const { minValue, maxValue } = gradeValidation;
  return {
    minValue,
    maxValue,
    // exemplo sem destructuring, maxValue: gradeValidation.maxValue,
  };
}

export {
  getAllGrades,
  insertGrade,
  updateGrade,
  deleteGrade,
  getValidationFromGradeType,
};
