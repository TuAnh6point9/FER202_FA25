import  Button from "react-bootstrap/Button";
import "./Footer.css"; 
function MyFooter() {
  return (
    <footer>
      <p>Author: TraLTB</p>
      <p>Created by: traltb@fe.edu.vn </p>
      <p>&copy; {new Date().getFullYear()} TraLTB. All rights reserved </p>
      <Button variant="link" href="" >My Link Github's project: Movies Management </Button>
    </footer>
  )
}
export default MyFooter;
