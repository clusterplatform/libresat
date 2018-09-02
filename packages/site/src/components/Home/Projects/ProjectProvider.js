import { Component } from "react";

export class ProjectProvider extends Component {
  state = {
    loading: true,
    lastUpdateDate: {},
    description: ""
  };

  componentDidMount = async () => {
    await this.getLastCommitDate({
      path: this.props.path
    });
    this.getDescription({
      path: this.props.path
    });
  };

  getLastCommitDate = async ({ path }) => {
    const response = await fetch(
      `${this.props.endpoint}/api/v4/projects/${
        this.props.projectID
      }/repository/commits?path=${path}`
    );
    const json = await response.json();
    this.setState({
      lastUpdateDate: new Date(json[0].committed_date)
    });
  };

  getDescription = async ({ path }) => {
    const response = await fetch(
      `${this.props.endpoint}/api/v4/projects/${
        this.props.projectID
      }/repository/tree/?path=${path}`
    );
    const json = await response.json();
    const packageJsonFile = json.filter(({ name }) => name === "package.json");
    const packageJsonBlobSHA = packageJsonFile[0].id;
    const packageJsonContentResponse = await fetch(
      `${this.props.endpoint}/api/v4/projects/${
        this.props.projectID
      }/repository/blobs/${packageJsonBlobSHA}/raw`
    );
    const { description } = await packageJsonContentResponse.json();
    this.setState({
      description,
      loading: false
    });
  };

  render = () =>
    this.props.children({
      ...this.props,
      ...this.state
    });
}