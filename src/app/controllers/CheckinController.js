import * as Yup from "yup";
import { formatISO, eachWeekOfInterval, isWithinInterval } from "date-fns";
import Checkins from "../models/Checkin";
import Student from "../models/Student";
import Enrollment from "../models/Enrollment";

class CheckinController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const checkins = await Checkins.findAll({
      where: { student_id: req.params.id },
      order: ["created_at"],
      attributes: ["id", "student_id", "created_at", "updated_at"],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: Student,
          as: "student",
          attributes: ["id", "name"]
        }
      ]
    });

    return res.json(checkins);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number()
        .integer()
        .required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation Fails" });
    }

    const { id, student_id } = req.body;
    const enrollment = Enrollment.findOne({
      where: { student_id: req.params.id }
    });

    if (!enrollment) {
      return res.status(404).json({ error: "Identification does not found" });
    }

    const { start_date, end_date } = enrollment;

    const weeksOfTraining = eachWeekOfInterval({
      start: formatISO(start_date),
      end: formatISO(end_date)
    });

    for (const i = 0; i < weeksOfTraining.length; i + 1) {
      const checkinPerWeek = isWithinInterval(
        new Date(),
        weeksOfTraining[i],
        weeksOfTraining[i + 1]
      );

      const countDatesCheckinOfInterval = Checkins.count({
        where: {
          created_at: {
            between: [weeksOfTraining[i], weeksOfTraining[i + 1]]
          }
        }
      });

      if (checkinPerWeek && countDatesCheckinOfInterval <= 5) {
        await Checkins.create({
          id,
          student_id
        });
        return res
          .status(200)
          .json({ error: `Checkin número:${countDatesCheckinOfInterval}` });
      }
      return res.status(400).json({ error: "Number of checkins exceeded" });
    }
  }
}

export default new CheckinController();
