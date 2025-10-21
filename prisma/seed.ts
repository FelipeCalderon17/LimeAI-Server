import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seeding proccess...");
  await prisma.note.deleteMany();
  console.log("Old notes deleted.");
  await prisma.patient.deleteMany();
  console.log("Old patients deleted.");

  const patient1 = await prisma.patient.create({
    data: {
      name: "Arturo Morgan",
      dateOfBirth: new Date("1985-05-15"),
    },
  });

  const patient2 = await prisma.patient.create({
    data: {
      name: "Sadie Adler",
      dateOfBirth: new Date("1992-11-01"),
    },
  });

  const patient3 = await prisma.patient.create({
    data: {
      name: "John Marston",
      dateOfBirth: new Date("1978-02-28"),
    },
  });

  const note1 = await prisma.note.create({
    data: {
      patientId: patient1.id,
      rawInput: "El paciente reporta dolor de cabeza y fiebre leve.",
      processedOutput:
        "S: Paciente con cefalea y febrícula.\nO: T 37.5°C.\nA: Posible infección viral.\nP: Reposo e hidratación. Reevaluar en 48h.",
    },
  });

  console.log("Nota de ejemplo creada:");
  console.log(note1);

  console.log("Patients created:");
  console.log(patient1, patient2, patient3);
  console.log("✅ Seeding completado exitosamente.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
