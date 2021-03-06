import React                from "react"
import ReactDOM             from "react-dom"

import CreateJS             from "easeljs"
import CandleSticks         from "./candle-sticks"
import Background           from "./background"
import Axises               from "./axises"
import Slider               from "./slider"
import GraphView            from "./graph-view"
import PositionsView        from "./positions-view"
import Pointer              from "./pointer"
import CoordinateCalculator from "../../../viewmodel/chart/coordinate-calculator"
import Theme                from "../../theme"
import StageUpdater         from "./stage-updater"

const padding = CoordinateCalculator.padding();

export default class Chart extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
  }

  componentDidMount() {
    this.props.model.reset();
    this.props.model.stageSize = this.props.size;
    const canvas = ReactDOM.findDOMNode(this.refs.canvas);

    this.buildStage(canvas, this.props.devicePixelRatio);
    this.buildViewComponents();

    this.registerSlideAction();
    this.initViewComponents();
    this.props.model.initialize();
  }

  componentWillUnmount() {
    this.axises.unregisterObservers();
    this.candleSticks.unregisterObservers();
    this.graphView.unregisterObservers();
    this.positionsView.unregisterObservers();
    this.pointer.unregisterObservers();
  }

  render() {
    const r = this.props.devicePixelRatio;
    return (
      <div>
        <canvas ref="canvas"
          width={this.props.size.w*r}
          height={this.props.size.h*r}
          style={{
            width: this.props.size.w+"px",
            height: this.props.size.h+"px"
        }}>
        </canvas>
      </div>
    );
  }

  buildStage(canvas, scale) {
    this.stage = new CreateJS.Stage(canvas);
    this.stage.scaleX = scale;
    this.stage.scaleY = scale;
    CreateJS.Touch.enable(this.stage, true, true);
    this.stage.preventSelection = false;

    this.stageUpdater = new StageUpdater(this.stage);
  }

  buildViewComponents() {
    this.slidableMask = this.createSlidableMask();
    this.slidable     = this.createSlidableMask(
      Theme.palette.backgroundColorDark);
    const model = this.props.model;

    const dpr = this.props.devicePixelRatio;
    this.background    = new Background( model, dpr );
    this.axises        = new Axises( model, this.slidableMask, dpr );
    this.candleSticks  = new CandleSticks( model, this.slidableMask, dpr );
    this.graphView     = new GraphView( model, this.slidableMask, dpr );
    this.positionsView = new PositionsView( model, this.slidableMask, dpr );
    this.pointer       = new Pointer( model, this.slidableMask, dpr );
  }
  initViewComponents() {
    this.background.attach( this.stage, this.stageUpdater );
    this.stage.addChild(this.slidable);

    this.axises.attach( this.stage, this.stageUpdater );
    this.pointer.attach( this.stage, this.stageUpdater );
    this.candleSticks.attach( this.stage, this.stageUpdater );
    this.graphView.attach( this.stage, this.stageUpdater );
    this.positionsView.attach( this.stage, this.stageUpdater );
  }

  registerSlideAction() {
    this.slidable.addEventListener("mousedown", (event) => {
      if (this.pointer.slideXStart != null
       || this.pointer.slideYStart != null) {
        return;
      }
      this.slideStart = event.stageX;
      this.props.model.slider.slideStart();
      event.preventDefault();
      event.nativeEvent.preventDefault();
    });
    this.slidable.addEventListener("pressmove", (event) => {
      if (!this.slideStart) return;
      this.doSlide( event.stageX );
      event.preventDefault();
      event.nativeEvent.preventDefault();
    });
    this.slidable.addEventListener("pressup", (event) => {
      if (!this.slideStart) return;
      this.props.model.slider.slideEnd();
      this.slideStart = null;
      event.preventDefault();
      event.nativeEvent.preventDefault();
    });
  }

  doSlide(x) {
    x = Math.ceil((this.slideStart - x) / (6*this.props.devicePixelRatio)) * -6;
    this.props.model.slider.slideByChart(x/6);
  }

  createSlidableMask(color="#000") {
    const stageSize    = this.props.model.candleSticks.stageSize;
    const axisPosition = this.props.model.candleSticks.axisPosition;
    const mask         = new CreateJS.Shape();
    mask.graphics.beginFill(color)
      .drawRect( padding, padding, axisPosition.horizontal - padding, stageSize.h )
      .endFill();
    return mask;
  }
}
Chart.propTypes = {
  devicePixelRatio: React.PropTypes.number.isRequired,
  size: React.PropTypes.object.isRequired,
  model: React.PropTypes.object.isRequired
};
Chart.defaultProps = {
  devicePixelRatio: window.devicePixelRatio || 1,
  size: {w:600, h:500}
};
