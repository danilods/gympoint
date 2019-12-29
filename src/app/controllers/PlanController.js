import * as Yup from "yup";
import Plan from "../models/Plan";

class StudentController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const plans = await Plan.findAll({
      order: ["name"],
      attributes: ["id", "name", "email", "idade", "altura", "peso"],
      limit: 20,
      offset: (page - 1) * 20
    });
    return res.json(plans);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number()
        .integer()
        .required(),
      price: Yup.number()
        .integer()
        .required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation Fails" });
    }

    const planExists = await Plan.findOne({
      where: { title: req.body.title }
    });

    if (planExists) {
      return res.status(400).json({ error: "Plan already exists" });
    }
    const { id, title, duration, price } = await Plan.create(req.body);

    return res.json({
      id,
      title,
      duration,
      price
    });
  }

  async update(req, res) {
    // schema de validacao para atualizacao de aluno
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number()
        .integer()
        .required(),
      price: Yup.number()
        .integer()
        .required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation Fails" });
    }

    const planId = req.params.id;

    const { title } = req.body;

    const plan = await Plan.findByPk(planId);

    if (title !== plan.title) {
      const studentExists = await Plan.findOne({ where: { title } });

      if (studentExists) {
        return res.status(400).json({ error: "Plan already exists." });
      }
    }

    await plan.update(req.body);

    const { id, duration, price } = await Plan.findByPk(planId, {});

    return res.json({
      id,
      title,
      duration,
      price
    });
  }

  async delete(req, res) {
    const plan = await Plan.findByPk(req.params.id);

    if (!plan) {
      return res.status(404).json("Plan not found");
    }
    await plan.destroy();

    return res.status(200).json("Plan successfully deleted");
  }
}

export default new StudentController();
