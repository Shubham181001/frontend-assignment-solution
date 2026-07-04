import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import { tasksSlice } from "../store/slices/tasksSlice";
import Task from "../components/Task";

describe("Task Selection", () => {

    it("dispatches selectTask when clicked", () => {

        const store = configureStore({
            reducer:{
                tasks: tasksSlice.reducer
            }
        });

        render(

            <Provider store={store}>

                <Task
                    taskId="1"
                    title="Task 1"
                    type="image"
                    status="DONE"
                />

            </Provider>

        );

        fireEvent.click(screen.getByText("Task 1"));

        expect(store.getState().tasks.selectedTaskId)
            .toBe("1");

    });

});