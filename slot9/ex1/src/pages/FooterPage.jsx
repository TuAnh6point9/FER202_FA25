import MyFooter from "../components/Footer/MyFooter";

export default function FooterPage() {
    return (
       <div className="footer">
    <h2 style={{textAlign: "center", maxWidth: 600, margin: "0 auto"}} aria-hidden="true"></h2>
       <MyFooter author="TraLTB" email = "traltb@fe.edu.vn" linkGithub="Movie Management Project" />
       </div>
    );
}
