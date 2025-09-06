import { useRef, useState } from "react";

function NewCountry({ onAdd }) {
	const [open, setOpen] = useState(false);
	const [name, setName] = useState("");
	const inputReference = useRef();

	//create a function the handles the opening of the modal
	function handleOpen() {
		setOpen(true);
		//this setTimeout makes sure the modal is for sure open before focusing on the user input field value.
		setTimeout(
			() => inputReference.current && inputReference.current.focus(),
			0
		);
	}

	//create a function that closes the modal and sets the input field back to an empty box
	function handleClose() {
		setOpen(false);
		setName("");
	}

	//create a function that handles the submission of the form
	function handleSubmit(e) {
		e.preventDefault();
		//there needs to be input validation that takes the spaces away from the input
		const userAnswerTrimmed = name.trim();
		//needs to make sure the box has text characters and not just spaces
		if (userAnswerTrimmed.length === 0) {
			return;
		}
		onAdd(userAnswerTrimmed);
		handleClose();
	}

	return (
		<>
			<div>
				<button
					className="new-country-btn"
					onClick={handleOpen}
				>
					<b>+</b>
				</button>
				{open && (
					<dialog
						className="modal"
						open
					>
						<form
							className="new-country-form"
							onSubmit={handleSubmit}
						>
							<label>
								Country Name:{" "}
								{/*this is just to create some space in between the label and input */}
								<input
									type="text"
									name="new country"
									id="new country"
									ref={inputReference}
									value={name}
									onChange={(e) => setName(e.target.value)}
									autoFocus
								/>
							</label>
							<div>
								<button
									type="submit"
									className="add-country-btn"
									disabled={name.trim().length === 0}
								>
									Add
								</button>
								<button
									className="cancel-btn"
									type="button"
									onClick={handleClose}
								>
									Cancel
								</button>
							</div>
						</form>
					</dialog>
				)}
			</div>
		</>
	);
}

export default NewCountry;
