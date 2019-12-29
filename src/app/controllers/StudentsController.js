import * as Yup from "yup";
import Student from "../models/Student";

class StudentController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const students = await Student.findAll({
      order: ["name"],
      attributes: ["id", "name", "email", "idade", "altura", "peso"],
      limit: 20,
      offset: (page - 1) * 20
    });
    return res.json(students);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      idade: Yup.number()
        .integer()
        .required(),
      peso: Yup.number()
        .integer()
        .required(),
      altura: Yup.number().integer()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation Fails" });
    }

    const userExists = await Student.findOne({
      where: { email: req.body.email }
    });

    if (userExists) {
      return res.status(400).json({ error: "User already exists" });
    }
    const { id, name, email, idade, peso, altura } = await Student.create(
      req.body
    );

    return res.json({
      id,
      name,
      email,
      idade,
      peso,
      altura
    });
  }

  async update(req, res) {
    // schema de validacao para atualizacao de aluno
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      idade: Yup.number()
        .integer()
        .required(),
      peso: Yup.number()
        .integer()
        .required(),
      altura: Yup.number().integer()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation Fails" });
    }

    const studentId = req.params.id;

    const { email } = req.body;

    const student = await Student.findByPk(studentId);

    if (email !== student.email) {
      const studentExists = await Student.findOne({ where: { email } });

      if (studentExists) {
        return res.status(400).json({ error: "User already exists." });
      }
    }

    await student.update(req.body);

    const { id, name, idade, altura, peso } = await Student.findByPk(
      studentId,
      {}
    );

    return res.json({
      id,
      name,
      email,
      idade,
      peso,
      altura
    });
  }
}

export default new StudentController();
