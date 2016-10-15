(function () {
    "use strict";

    var Post = React.createClass({
        render: function () {
            var post = this.props.post;
            var content;

            if (post.isWorkNote) {
                content = <div>{post.text}</div>
            } else if (post.isWorkWriting) {
                content = (
                    <div>
                        {post.text ? <div>{post.text}<br/></div> : null}
                        <img src={post.image} width="250" alt=""/>
                    </div>
                )
            } else if (post.isWorkAudio) {
                content = (
                    <div>
                        {post.text ? <div>{post.text}<br/></div> : null}
                        <audio src={post.audio} controls="controls"/>
                    </div>
                )
            }

            return (
                <tr>
                    <td>
                        <div className="user-wap">
                            <img src={post.user.avatar} alt="" className="user-avatar"/>
                            <span className="user-name">{post.user.username}</span>
                        </div>

                        <div className="content">
                            {content}
                        </div>

                        <div className="work">
                            <a href={"/work/" + post.work.id} target="_blank">
                                {post.work.author}《{post.work.title}》</a>
                        </div>

                        <div className="status-wap">
                            {post.selected ? <span className="label label-info selected-label">精选</span> : null}
                        </div>

                        <div className="meta-wap">
                            {post.likesCount} 赞&nbsp;&nbsp;{post.commentsCount} 评论
                        </div>
                    </td>
                    <td>
                        <div className="btn-group btn-group-xs">
                            <button type="button" className="btn btn-default" data-id=""
                                    onClick={this.props.handleToggle.bind(null, post)}>
                                {post.wxSelected ? "取消选择" : "选择"}
                            </button>
                        </div>
                    </td>
                </tr>
            );
        }
    });

    var PostList = React.createClass({
        render: function () {
            var posts = this.props.posts.map(function (post) {
                return (
                    <Post post={post} key={post.id} handleToggle={this.props.handleToggle}/>
                );
            }, this);

            return (
                <tbody class="posts">
                {posts}
                </tbody>
            )
        }
    });

    var User = React.createClass({
        render: function () {
            var suffix;

            if (this.props.post.isWorkAudio) {
                suffix = "语音";
            } else if (this.props.post.isWorkWriting) {
                suffix = "写字";
            } else {
                suffix = "笔记";
            }

            return (
                <section className="user-wap">
                    <img src={this.props.user.avatar} alt="" className="avatar"/>
                    <section className="username">
                        {this.props.user.username} · {suffix}
                    </section>
                </section>
            )
        }
    });

    var Work = React.createClass({
        render: function () {
            return (
                <section className={"work-wap work-layout-"+this.props.work.layout}>
                    <section className="inner-wap">
                        <section className="title">{this.props.work.title}</section>
                        <section className="author">[{this.props.work.dynasty}] {this.props.work.author}</section>
                        <section className="content" dangerouslySetInnerHTML={this.props.work.content}/>
                    </section>
                </section>
            )
        }
    });

    var WorkAudio = React.createClass({
        render: function () {
            return (
                <section className="work-accessory work-audio">
                    <User user={this.props.post.user} post={this.props.post}/>
                    {this.props.post.text ? <section className="text">{this.props.post.text}</section> : null}
                    <section className="audio">
                        <p>这里插入语音</p>
                    </section>
                    <Work work={this.props.post.work}/>
                </section>
            )
        }
    });

    var WorkWriting = React.createClass({
        render: function () {
            return (
                <section className="work-accessory work-writing">
                    <User user={this.props.post.user} post={this.props.post}/>
                    {this.props.post.text ? <section className="text">{this.props.post.text}</section> : null}
                    <section className="image-wap">
                        <img src={this.props.post.image} alt=""/>
                    </section>
                    <Work work={this.props.post.work}/>
                </section>
            )
        }
    });

    var WorkNote = React.createClass({
        render: function () {
            return (
                <section className="work-accessory work-note">
                    <User user={this.props.post.user} post={this.props.post}/>
                    <section className="note">{this.props.post.text}</section>
                    <Work work={this.props.post.work}/>
                </section>
            )
        }
    });

    var WechatPost = React.createClass({
        render: function () {
            var posts = this.props.posts;
            var workAudios = posts
                .filter((post) => post.wxSelected && post.isWorkAudio)
                .map((post) => {
                    return <WorkAudio post={post}/>
                });
            var workWritings = posts
                .filter((post) => post.wxSelected && post.isWorkWriting)
                .sort((postA, postB) => {
                    return postB.likesCount - postA.likesCount
                })
                .map((post) => {
                    return <WorkWriting post={post}/>
                });
            var workNotes = posts
                .filter((post) => post.wxSelected && post.isWorkNote)
                .sort((postA, postB) => {
                    return postB.likesCount - postA.likesCount
                })
                .map((post) => {
                    return <WorkNote post={post}/>
                });

            return (
                <section className="wechat-post" id="wechat-post">
                    <section className="content">
                        {workAudios}
                        {workWritings}
                        {workNotes}
                    </section>

                    <section className="footer">
                        <section className="gap">
                            <section />
                        </section>

                        <section className="market-image">
                            <img
                                src="https://mmbiz.qlogo.cn/mmbiz_png/US3392GZN3cyOtZeQgxRibHB6uTWibqROeKicNhwiaIC7D2vJCfAUZbOrknjlHCYs4ofVjia4nJTfg7JwfnGNB5LupQ/0?wx_fmt=png"
                                alt=""/>
                        </section>

                        <section className="tips">点击“阅读原文”，下载西窗烛 App，欣赏更多语音、写字、笔记。</section>
                    </section>
                </section>
            )
        }
    });

    var PageContent = React.createClass({
        getInitialState: function () {
            return {
                postsAlreadyUploaded: 0,
                posts: [],
                selectedPosts: [],
                uploading: false,
                converting: false
            };
        },
        componentDidMount: function () {
            $.ajax({
                url: "data.json",
                dataType: 'json',
                success: function (data) {
                    this.setState({posts: data});
                }.bind(this)
            });
        },
        // 切换选择
        handleToggle: function (postToToggle) {
            if (this.state.posts.filter((post) => post.wxSelected && post.isWorkAudio).length > 0
                && postToToggle.isWorkAudio && !postToToggle.wxSelected) {
                alert("已经选过语音了。");
                return
            }

            this.setState({
                posts: this.state.posts.map(function (post) {
                    return post.id !== postToToggle.id ?
                        post : Object.assign({}, post, {wxSelected: !postToToggle.wxSelected})
                })
            })
        },
        // 上传素材
        handleUpload: function () {
            var ajaxs = [];

            this.state.posts
                .filter((post) => post.wxSelected)
                .forEach(function (post) {
                    // 上传用户头像
                    var avatarAjax = this.uploadImageToWechat(post.user.avatar, function (url) {
                        this.setState({
                            posts: this.state.posts.map(function (originalPost) {
                                return originalPost.id !== post.id ?
                                    originalPost : Object.assign({}, originalPost, {
                                        user: {
                                            avatar: url,
                                            username: post.user.username
                                        }
                                    }
                                )
                            })
                        })
                    }.bind(this));

                    if (avatarAjax) {
                        ajaxs.push(avatarAjax);
                    }

                    // 上传图片
                    if (post.image) {
                        var imageAjax = this.uploadImageToWechat(post.image, function (url) {
                            this.setState({
                                posts: this.state.posts.map(function (originalPost) {
                                    return originalPost.id !== post.id ?
                                        originalPost : Object.assign({}, originalPost, {image: url})
                                })
                            })
                        }.bind(this));

                        if (imageAjax) {
                            ajaxs.push(imageAjax);
                        }
                    }

                    if (ajaxs.length > 0) {
                        this.setState({
                            loading: true
                        })
                    }
                }, this);

            // 等待完成
            $.when.apply(null, ajaxs).done(function () {
                this.setState({
                    loading: false
                });

                if (this.calMaterialsAlreadyUploaded() === this.calMaterialsNeedToUpload()) {
                    this.copyToClipboard()
                }
            }.bind(this));
        },
        uploadImageToWechat: function (url, callback) {
            if (this.checkImageUploaded(url)) {
                return null
            }

            return $.ajax({
                method: 'post',
                url: "upload_image_result.json",
                data: {
                    url: url
                },
                success: function (data) {
                    callback(data.url)
                }
            });
        },
        checkImageUploaded: function (url) {
            return url.startsWith('http://mmbiz.qpic.cn')
        },
        calMaterialsNeedToUpload: function () {
            return this.state.posts.filter((post) => post.wxSelected && post.isWorkWriting).length * 2
                + this.state.posts.filter((post) => post.wxSelected && (post.isWorkNote || post.isWorkAudio)).length;
        },
        calMaterialsAlreadyUploaded: function () {
            var materialsAlreadyUploaded = 0;

            this.state.posts.filter((post) => post.wxSelected).forEach((post) => {
                if (this.checkImageUploaded(post.user.avatar)) {
                    materialsAlreadyUploaded += 1;
                }

                if (post.image && this.checkImageUploaded(post.image)) {
                    materialsAlreadyUploaded += 1;
                }
            }, this);

            return materialsAlreadyUploaded;
        },
        copyToClipboard: function () {
            var selection = window.getSelection();
            var range = document.createRange();

            range.selectNodeContents(document.getElementById('wechat-post'));
            selection.removeAllRanges();
            selection.addRange(range);
        },
        render: function () {
            var postsNeedToUpload = this.calMaterialsNeedToUpload();
            var postsAlreadyUploaded = this.calMaterialsAlreadyUploaded();
            var finish = postsNeedToUpload !== 0 && postsNeedToUpload === postsAlreadyUploaded;
            var loading = this.state.loading;
            var hasAudio = this.state.posts.filter((post) => post.wxSelected && post.audio).length > 0;
            var audioUrl = "http://7xpodt.com1.z0.glb.clouddn.com/cYHSmOK8RGE0BEGXBNu7NnC.mp3?attname=cYHSmOK8RGE0BEGXBNu7NnC.mp3"

            return (
                <div>
                    <div className="col-md-6">
                        <h2>今日内容</h2>

                        <table className='table table-striped table-hover table-posts'>
                            <thead>
                            <tr>
                                <th>内容</th>
                                <th>操作</th>
                            </tr>
                            </thead>

                            <PostList posts={this.state.posts} handleToggle={this.handleToggle}/>
                        </table>
                    </div>

                    <div className="col-md-6">
                        <h2>文章</h2>

                        <button className="btn btn-block btn-primary btn-generate" onClick={this.handleUpload}>
                            {finish ?
                                "生成完毕，请按复制键" :
                                <span>
                                    {loading ?
                                        <span className="fa fa-spin fa-spinner"/>
                                        : "开始生成"}
                                    &nbsp;&nbsp;{postsAlreadyUploaded} / {postsNeedToUpload}
                                        </span>
                            }
                        </button>

                        <a className="btn btn-block btn-default btn-download-audio"
                           href={audioUrl ? audioUrl : null} disabled={!hasAudio}>
                            <span className="fa fa-download"/> 下载音频文件
                        </a>

                        <WechatPost posts={this.state.posts}/>
                    </div>
                </div>
            )
        }
    });

    ReactDOM.render(
        <PageContent />,
        document.getElementById('react-container')
    );
})();
