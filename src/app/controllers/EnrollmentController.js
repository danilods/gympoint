import * as Yup from "yup";
import { parseISO, addMonths } from "date-fns";
import Enrollment from "../models/Enrollment";
import Student from "../models/Student";
import Plan from "../models/Plan";

class EnrollmentController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const enrollments = await Enrollment.findAll({
      order: ["start_date"],
      attributes: ["id", "start_date", "end_date", "price", "plan_id"],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: Student,
          as: "student",
          attributes: ["id", "name"]
        },
        {
          model: Plan,
          as: "plans",
          attributes: ["id", "title", "duration", "price"]
        }
      ]
    });

    return res.json(enrollments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number()
        .integer()
        .required(),
      plan_id: Yup.number()
        .integer()
        .required(),
      start_date: Yup.date().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation Fails" });
    }

    const { id, student_id, start_date, plan_id } = req.body;

    const enrollmentExists = await Enrollment.findOne({
      where: { student_id: req.body.student_id }
    });

    if (enrollmentExists) {
      return res.status(400).json({ error: "Enrollment already exists" });
    }

    const plan = await Plan.findOne({
      where: { id: plan_id }
    });

    const endDateEnrollment = addMonths(parseISO(start_date), plan.duration);

    const priceEnrollment = plan.price * plan.duration;

    const enrollments = await Enrollment.create({
      id,
      student_id,
      start_date,
      plan_id,
      end_date: endDateEnrollment,
      price: priceEnrollment
    });

    return res.json(enrollments);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number()
        .integer()
        .required(),
      plan_id: Yup.number()
        .integer()
        .required(),
      start_date: Yup.date().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation Fails" });
    }

    const { enrollmentId, studentId } = req.params;

    const { start_date, plan_id } = req.body;

    const enrollment = await Enrollment.findOne({
      where: { id: enrollmentId, student_id: studentId }
    });

    if (!enrollment) {
      return res.status(400).json({ error: "Enrollment does not exists." });
    }

    const plan = await Plan.findOne({
      where: { id: plan_id }
    });

    const endDateEnrollment = addMonths(parseISO(start_date), plan.duration);

    const priceEnrollment = plan.price * plan.duration;

    await enrollment.update({
      start_date,
      end_date: endDateEnrollment,
      price: priceEnrollment,
      plan_id
    });

    const updatedEnrollment = await Enrollment.findByPk(enrollmentId, {
      include: [
        {
          model: Student,
          as: "student",
          attributes: ["id", "name"]
        },
        {
          model: Plan,
          as: "plans",
          attributes: ["id", "title", "duration", "price"]
        }
      ]
    });

    return res.json(updatedEnrollment);
  }

  async delete(req, res) {
    const { enrollmentId, studentId } = req.params;

    const enrollment = await Enrollment.findOne({
      where: { id: enrollmentId, student_id: studentId }
    });

    if (!enrollment) {
      return res.status(400).json({ error: "Enrollment does not exists." });
    }
    await enrollment.destroy();

    return res.status(200).json("Enrollment successfully deleted");
  }
}

export default new EnrollmentController();
