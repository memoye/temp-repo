import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "./big-calendar-styles.css";
import { Calendar as BigCalendar } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";

export const CustomBigCalendar = withDragAndDrop(BigCalendar);
