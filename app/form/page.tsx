import Link from "next/link";

export default function HomePage() {
	return (
		<div style={{ textAlign: "center", padding: "20px" }}>
			<h1>Welcome to the Form Management System</h1>
			<p>Choose an option below to navigate:</p>
			<div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
				<Link href="/form/createConfig">
					<button style={buttonStyle}>Create Form Config</button>
				</Link>
				<Link href="/form/creatCourse">
					<button style={buttonStyle}>Create Course</button>
				</Link>
				<Link href="/form/view-configs">
					<button style={buttonStyle}>View Configurations</button>
				</Link>
				<Link href="/form/form-submissions">
					<button style={buttonStyle}>View Form Submissions</button>
				</Link>
			</div>
		</div>
	);
}

const buttonStyle = {
	padding: "10px 20px",
	fontSize: "16px",
	backgroundColor: "#0070f3",
	color: "#fff",
	border: "none",
	borderRadius: "5px",
	cursor: "pointer",
	transition: "0.3s",
};
