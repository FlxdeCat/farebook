package service

import (
	"context"

	"github.com/FlxdeCat/faREbook-backend/database"
	"github.com/FlxdeCat/faREbook-backend/graph/model"
	"gorm.io/gorm"
)

var db *gorm.DB = database.GetInstance()

func GetUser(ctx context.Context, id string) (*model.User, error) {
	var user *model.User
	return user, db.First(&user, "id = ?", id).Error
}

func GetPost(ctx context.Context, id string) (*model.Post, error) {
	var post *model.Post
	return post, db.First(&post, "id = ?", id).Error
}

func GetComment(ctx context.Context, id string) (*model.Comment, error) {
	var comment *model.Comment
	return comment, db.First(&comment, "id = ?", id).Error
}

func GetReply(ctx context.Context, id string) (*model.Reply, error) {
	var reply *model.Reply
	return reply, db.First(&reply, "id = ?", id).Error
}

func GetGroup(ctx context.Context, id string) (*model.Group, error) {
	var group *model.Group
	return group, db.First(&group, "id = ?", id).Error
}
