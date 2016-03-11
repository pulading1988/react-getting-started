var Comment = React.createClass({
	rawMarkup:function(){
		var rawMarkup = marked(this.props.children.toString(),{sanitize: true});
    return {__html: rawMarkup};
	},
	render:function(){
		return(
			<div className="card facebook-card">
      	<div className="card-header">
      		<div className="facebook-avatar"><img src="http://reactjs.cn/react/img/logo.svg" width="34" height="34" /></div>
        	<div className="facebook-name">{this.props.author}</div>
        	<div className="facebook-date">2016-01-28 3:47pm</div>
      	</div>
      	<div className="card-content">
        	<div className="card-content-inner" dangerouslySetInnerHTML={this.rawMarkup()}></div>
      	</div>
      	<div className="card-footer">
        	<a href="#" className="link">赞</a>
	        <a href="#" className="link">评论</a>
	        <a href="#" className="link">分享</a>
      	</div>
    	</div>
		);
	}
});

var CommentList = React.createClass({
	render:function(){
		var commentsNodes = this.props.data.map(function(comment,index){
			return(
				<Comment key={'comment'+index} author={comment.author}>
					{comment.text}
				</Comment>
			);
		});

		return(
			<div>
        {commentsNodes}
      </div>
		);
	}
});

var CommentForm = React.createClass({
	getInitialState:function(){
		return {author:'',title:'',text:''};
	},
	handleAuthorChange:function(e){
		this.setState({author:e.target.value});
	},
	handleTextChange:function(e){
		this.setState({text:e.target.value});
	},
	handleSubmit:function(e){
		e.preventDefault();
		var author = this.state.author.trim();
		var text = this.state.text.trim();
		if (!author || !text) {
			return;
		}

    this.props.onCommentSubmit({author:author,text:text});
    this.setState({author:'',text:''});		
	},
	render:function(){
		return(
			<div>
				<div className="content-block list-block">
					<ul>
						<li>
		          <div className="item-content">
		            <div className="item-inner">
		              <div className="item-title label">大名</div>
		              <div className="item-input">
		                <input type="text" placeholder="Your name" value={this.state.author} onChange={this.handleAuthorChange} />
		              </div>
		            </div>
		          </div>
		        </li>
		        <li>
		          <div className="item-content">
		            <div className="item-inner">
		              <div className="item-title label">评论</div>
		              <div className="item-input">
		              	<input type="text" placeholder="Say something..." value={this.state.text} onChange={this.handleTextChange} />
		              </div>
		            </div>
		          </div>
		        </li>
					</ul>
				</div>
				<div className="content-block">
					<a type="submit" className="button button-big button-fill button-success" onClick={this.handleSubmit}>提交</a>
				</div>
			</div>
		);
	}
});

var CommentBox = React.createClass({
	loadCommentsFromServer:function(){
		$.ajax({
		  url:this.props.url,
		  dataType:'json',
		  success: function(data){
		  	this.setState({data:data});
		  }.bind(this),
		  error: function(xhr, status, err){
		    console.error(this.props.url, status, err.toString());
		  }.bind(this)
		});
	},
	handleCommentSubmit:function(comment){
		var comments = this.state.data;
		var newComments = comments.concat([comment]);
		this.setState({data:newComments});
		$.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
      	this.setState({data:comments});
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
	getInitialState:function(){
		return {data:[]};
	},
	componentDidMount:function(){
		this.loadCommentsFromServer();
		setInterval(this.loadCommentsFromServer,this.props.pollInterval)
	},
	render:function(){
		return(
			<div>
        <CommentList data={this.state.data} />
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
      </div>
		);
	}
});

ReactDOM.render(
	<CommentBox url="/api/comments" pollInterval={5000} />,
	document.getElementById('content')
);