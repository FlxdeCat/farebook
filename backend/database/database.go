package database

import (
	"github.com/FlxdeCat/faREbook-backend/graph/model"
	"github.com/FlxdeCat/faREbook-backend/helper"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var database *gorm.DB

func GetInstance() *gorm.DB {
	if database == nil {
		db, err := gorm.Open(postgres.Open(helper.GetEnvVariable("DATABASE")), &gorm.Config{})
		if err != nil {
			panic(err)
		} else {
			database = db
		}
	}
	return database
}

func MigrateTable() {
	db := GetInstance()
	db.AutoMigrate(&model.User{}, &model.Friend{}, &model.RemoveSuggestion{}, &model.BlockNotification{}, &model.Post{}, &model.PostLike{}, &model.Comment{}, &model.Reply{}, &model.CommentLike{}, &model.ReplyLike{}, &model.Group{}, &model.GroupMember{})
}
