import { Page as PagePresentation, IPageProps } from "components/presentation/Page";
import { connect } from "react-redux";
import { IState } from "store/interfaces/State";

const mapStateToProps = (state: IState, ownProps: IPageProps): {} => {
    const language = state.language;
    return { language };
};

// const mergeProps = (stateProps: {}, dispatchProps: {}, ownProps: IPageProps) => {
//     return Object.assign({}, ownProps, stateProps);
// };

// export const Page = connect(mapStateToProps, {}, mergeProps)(PagePresentation);

export const Page = connect(mapStateToProps)(PagePresentation);
