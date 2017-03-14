import { connect } from "react-redux";
import { Home as HomePresentation } from "components/presentation/Home";
import { changeLanguage } from "store/actions/Actions";
import { IState } from "store/interfaces/State";

const mapStateToProps = (state: IState): {} => ({
    language: state.language
});

const mapDispatchToProps = {
    onLanguageChange: changeLanguage
};

export const Home = connect(mapStateToProps, mapDispatchToProps)(HomePresentation);
